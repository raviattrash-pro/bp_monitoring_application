package com.bpdashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AppointmentRequest {
    @NotBlank(message = "Doctor name is required")
    @Size(max = 120)
    private String doctorName;
    @Size(max = 120)
    private String specialty;
    @NotBlank(message = "Appointment date/time is required")
    private String appointmentDateTime;
    @Size(max = 180)
    private String location;
    @Size(max = 220)
    private String purpose;
    private String followUpDate;
    private String status;
    @Size(max = 1000)
    private String notes;

    public AppointmentRequest() {
    }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(String appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
