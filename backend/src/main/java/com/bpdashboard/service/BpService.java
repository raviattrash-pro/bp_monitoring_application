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
                csv.append("Date,Time,Systolic,Diastolic\n");

                for (BpReading r : readings) {
                        csv.append(r.getReadingDate()).append(",")
                                        .append(r.getTimeOfDay().name()).append(",")
                                        .append(r.getSystolic()).append(",")
                                        .append(r.getDiastolic()).append("\n");
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

                                String[] parts = line.split(",");
                                if (parts.length < 4)
                                        continue;

                                try {
                                        BpReading reading = BpReading.builder()
                                                        .readingDate(LocalDate.parse(parts[0].trim()))
                                                        .timeOfDay(BpReading.TimeOfDay
                                                                        .valueOf(parts[1].trim().toUpperCase()))
                                                        .systolic(Integer.parseInt(parts[2].trim()))
                                                        .diastolic(Integer.parseInt(parts[3].trim()))
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
                                .timeOfDay(reading.getTimeOfDay().name())
                                .readingDate(reading.getReadingDate().toString())
                                .build();
        }
}
