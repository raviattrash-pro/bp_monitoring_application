package com.bpdashboard.service;

import com.bpdashboard.dto.BpReadingRequest;
import com.bpdashboard.dto.BpReadingResponse;
import com.bpdashboard.model.BpReading;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.BpReadingRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

@Service
public class BpService {

        private final BpReadingRepository bpReadingRepository;
        private final UserRepository userRepository;

        @Autowired
        public BpService(BpReadingRepository bpReadingRepository, UserRepository userRepository) {
                this.bpReadingRepository = bpReadingRepository;
                this.userRepository = userRepository;
        }

        public BpReadingResponse addReading(String email, BpReadingRequest request) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                BpReading reading = BpReading.builder()
                                .systolic(request.getSystolic())
                                .diastolic(request.getDiastolic())
                                .heartRate(request.getHeartRate())
                                .bloodSugar(request.getBloodSugar())
                                .oxygenSaturation(request.getOxygenSaturation())
                                .bodyTemperature(request.getBodyTemperature())
                                .weightKg(request.getWeightKg())
                                .notes(normalizeText(request.getNotes()))
                                .symptoms(normalizeText(request.getSymptoms()))
                                .timeOfDay(BpReading.TimeOfDay.valueOf(request.getTimeOfDay().toUpperCase()))
                                .readingDate(LocalDate.parse(request.getReadingDate()))
                                .user(user)
                                .build();

                BpReading saved = bpReadingRepository.save(reading);

                return toResponse(saved);
        }

        public List<BpReadingResponse> getReadings(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return bpReadingRepository.findByUserIdOrderByReadingDateAscTimeOfDayAsc(user.getId())
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        public byte[] exportReadingsToCsv(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                List<BpReading> readings = bpReadingRepository
                                .findByUserIdOrderByReadingDateAscTimeOfDayAsc(user.getId());

                StringBuilder csv = new StringBuilder();
                csv.append("Date,Time,Systolic,Diastolic,HeartRate,BloodSugar,OxygenSaturation,BodyTemperature,WeightKg,Notes,Symptoms\n");

                for (BpReading r : readings) {
                        csv.append(r.getReadingDate()).append(",")
                                        .append(r.getTimeOfDay().name()).append(",")
                                        .append(r.getSystolic()).append(",")
                                        .append(r.getDiastolic()).append(",")
                                        .append(safeCsvValue(r.getHeartRate())).append(",")
                                        .append(safeCsvValue(r.getBloodSugar())).append(",")
                                        .append(safeCsvValue(r.getOxygenSaturation())).append(",")
                                        .append(safeCsvValue(r.getBodyTemperature())).append(",")
                                        .append(safeCsvValue(r.getWeightKg())).append(",")
                                        .append(escapeCsv(r.getNotes())).append(",")
                                        .append(escapeCsv(r.getSymptoms())).append("\n");
                }

                return csv.toString().getBytes(StandardCharsets.UTF_8);
        }

        public int importReadingsFromCsv(String email, MultipartFile file) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                int count = 0;
                try (BufferedReader reader = new BufferedReader(
                                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                        String line;
                        boolean firstLine = true;
                        List<BpReading> toSave = new ArrayList<>();

                        while ((line = reader.readLine()) != null) {
                                if (line.trim().isEmpty())
                                        continue;
                                if (firstLine) {
                                        firstLine = false;
                                        if (line.toLowerCase().contains("date"))
                                                continue;
                                }

                                String[] parts = parseCsvLine(line);
                                if (parts.length < 4)
                                        continue;

                                try {
                                        BpReading reading = BpReading.builder()
                                                        .readingDate(LocalDate.parse(parts[0].trim()))
                                                        .timeOfDay(BpReading.TimeOfDay
                                                                        .valueOf(parts[1].trim().toUpperCase()))
                                                        .systolic(Integer.parseInt(parts[2].trim()))
                                                        .diastolic(Integer.parseInt(parts[3].trim()))
                                                        .heartRate(parseInteger(parts, 4))
                                                        .bloodSugar(parseInteger(parts, 5))
                                                        .oxygenSaturation(parseInteger(parts, 6))
                                                        .bodyTemperature(parseDouble(parts, 7))
                                                        .weightKg(parseDouble(parts, 8))
                                                        .notes(parseString(parts, 9))
                                                        .symptoms(parseString(parts, 10))
                                                        .user(user)
                                                        .build();
                                        toSave.add(reading);
                                        count++;
                                } catch (Exception e) {
                                        // Skip invalid rows
                                }
                        }
                        if (!toSave.isEmpty()) {
                                bpReadingRepository.saveAll(toSave);
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
                }
                return count;
        }

        public BpReadingResponse updateReading(String email, Long id, BpReadingRequest request) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                BpReading reading = bpReadingRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Reading not found"));

                if (!reading.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized to update this reading");
                }

                reading.setSystolic(request.getSystolic());
                reading.setDiastolic(request.getDiastolic());
                reading.setHeartRate(request.getHeartRate());
                reading.setBloodSugar(request.getBloodSugar());
                reading.setOxygenSaturation(request.getOxygenSaturation());
                reading.setBodyTemperature(request.getBodyTemperature());
                reading.setWeightKg(request.getWeightKg());
                reading.setNotes(normalizeText(request.getNotes()));
                reading.setSymptoms(normalizeText(request.getSymptoms()));
                reading.setTimeOfDay(BpReading.TimeOfDay.valueOf(request.getTimeOfDay().toUpperCase()));
                reading.setReadingDate(LocalDate.parse(request.getReadingDate()));

                BpReading saved = bpReadingRepository.save(reading);
                return toResponse(saved);
        }

        public void deleteReading(String email, Long id) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                BpReading reading = bpReadingRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Reading not found"));

                if (!reading.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Unauthorized to delete this reading");
                }

                bpReadingRepository.delete(reading);
        }

        private BpReadingResponse toResponse(BpReading reading) {
                return BpReadingResponse.builder()
                                .id(reading.getId())
                                .systolic(reading.getSystolic())
                                .diastolic(reading.getDiastolic())
                                .heartRate(reading.getHeartRate())
                                .bloodSugar(reading.getBloodSugar())
                                .oxygenSaturation(reading.getOxygenSaturation())
                                .bodyTemperature(reading.getBodyTemperature())
                                .weightKg(reading.getWeightKg())
                                .notes(reading.getNotes())
                                .symptoms(reading.getSymptoms())
                                .timeOfDay(reading.getTimeOfDay().name())
                                .readingDate(reading.getReadingDate().toString())
                                .build();
        }

        private Integer parseInteger(String[] parts, int index) {
                if (parts.length <= index || parts[index].trim().isEmpty()) {
                        return null;
                }
                return Integer.parseInt(parts[index].trim());
        }

        private Double parseDouble(String[] parts, int index) {
                if (parts.length <= index || parts[index].trim().isEmpty()) {
                        return null;
                }
                return Double.parseDouble(parts[index].trim());
        }

        private String parseString(String[] parts, int index) {
                if (parts.length <= index) {
                        return null;
                }
                return normalizeText(parts[index].replace("\"", "").trim());
        }

        private String normalizeText(String value) {
                if (value == null) {
                        return null;
                }
                String trimmed = value.trim();
                return trimmed.isEmpty() ? null : trimmed;
        }

        private String safeCsvValue(Object value) {
                return value == null ? "" : value.toString();
        }

        private String escapeCsv(String value) {
                if (value == null) {
                        return "";
                }
                return "\"" + value.replace("\"", "\"\"") + "\"";
        }

        private String[] parseCsvLine(String line) {
                List<String> values = new ArrayList<>();
                StringBuilder current = new StringBuilder();
                boolean inQuotes = false;

                for (int i = 0; i < line.length(); i++) {
                        char ch = line.charAt(i);

                        if (ch == '"') {
                                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                                        current.append('"');
                                        i++;
                                } else {
                                        inQuotes = !inQuotes;
                                }
                        } else if (ch == ',' && !inQuotes) {
                                values.add(current.toString());
                                current.setLength(0);
                        } else {
                                current.append(ch);
                        }
                }

                values.add(current.toString());
                return values.toArray(new String[0]);
        }
}
