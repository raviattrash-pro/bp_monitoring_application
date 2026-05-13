package com.bpdashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_name", nullable = false, length = 120)
    private String doctorName;

    @Column(length = 120)
    private String specialty;

    @Column(name = "appointment_datetime", nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(length = 180)
    private String location;

    @Column(length = 220)
    private String purpose;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.UPCOMING;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Status {
        UPCOMING, COMPLETED, CANCELLED
    }

    public Appointment() {
    }

    public Appointment(Long id, String doctorName, String specialty, LocalDateTime appointmentDateTime,
            String location, String purpose, LocalDate followUpDate, Status status, String notes, User user) {
        this.id = id;
        this.doctorName = doctorName;
        this.specialty = specialty;
        this.appointmentDateTime = appointmentDateTime;
        this.location = location;
        this.purpose = purpose;
        this.followUpDate = followUpDate;
        this.status = status != null ? status : Status.UPCOMING;
        this.notes = notes;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static AppointmentBuilder builder() { return new AppointmentBuilder(); }

    public static class AppointmentBuilder {
        private Long id;
        private String doctorName;
        private String specialty;
        private LocalDateTime appointmentDateTime;
        private String location;
        private String purpose;
        private LocalDate followUpDate;
        private Status status;
        private String notes;
        private User user;

        public AppointmentBuilder id(Long id) { this.id = id; return this; }
        public AppointmentBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public AppointmentBuilder specialty(String specialty) { this.specialty = specialty; return this; }
        public AppointmentBuilder appointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; return this; }
        public AppointmentBuilder location(String location) { this.location = location; return this; }
        public AppointmentBuilder purpose(String purpose) { this.purpose = purpose; return this; }
        public AppointmentBuilder followUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; return this; }
        public AppointmentBuilder status(Status status) { this.status = status; return this; }
        public AppointmentBuilder notes(String notes) { this.notes = notes; return this; }
        public AppointmentBuilder user(User user) { this.user = user; return this; }

        public Appointment build() {
            return new Appointment(id, doctorName, specialty, appointmentDateTime, location, purpose, followUpDate,
                    status, notes, user);
        }
    }
}
