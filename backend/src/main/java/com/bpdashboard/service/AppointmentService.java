package com.bpdashboard.service;

import com.bpdashboard.dto.AppointmentRequest;
import com.bpdashboard.dto.AppointmentResponse;
import com.bpdashboard.model.Appointment;
import com.bpdashboard.model.User;
import com.bpdashboard.repository.AppointmentRepository;
import com.bpdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public List<AppointmentResponse> getAll(String email) {
        User user = getUser(email);
        return appointmentRepository.findByUserIdOrderByAppointmentDateTimeAsc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse add(String email, AppointmentRequest request) {
        User user = getUser(email);
        Appointment appointment = Appointment.builder()
                .doctorName(request.getDoctorName().trim())
                .specialty(normalize(request.getSpecialty()))
                .appointmentDateTime(LocalDateTime.parse(request.getAppointmentDateTime()))
                .location(normalize(request.getLocation()))
                .purpose(normalize(request.getPurpose()))
                .followUpDate(parseDate(request.getFollowUpDate()))
                .status(parseStatus(request.getStatus()))
                .notes(normalize(request.getNotes()))
                .user(user)
                .build();
        return toResponse(appointmentRepository.save(appointment));
    }

    public void delete(String email, Long id) {
        User user = getUser(email);
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        authorize(user, appointment.getUser().getId());
        appointmentRepository.delete(appointment);
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setDoctorName(appointment.getDoctorName());
        response.setSpecialty(appointment.getSpecialty());
        response.setAppointmentDateTime(appointment.getAppointmentDateTime().toString());
        response.setLocation(appointment.getLocation());
        response.setPurpose(appointment.getPurpose());
        response.setFollowUpDate(appointment.getFollowUpDate() != null ? appointment.getFollowUpDate().toString() : null);
        response.setStatus(appointment.getStatus().name());
        response.setNotes(appointment.getNotes());
        return response;
    }

    private Appointment.Status parseStatus(String value) {
        return value == null || value.isBlank() ? Appointment.Status.UPCOMING : Appointment.Status.valueOf(value.toUpperCase());
    }

    private LocalDate parseDate(String value) {
        return value == null || value.isBlank() ? null : LocalDate.parse(value);
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void authorize(User user, Long ownerId) {
        if (!ownerId.equals(user.getId())) throw new RuntimeException("Unauthorized");
    }
}
