package com.bpdashboard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BpReadingRequest {
    @NotNull(message = "Systolic value is required")
    @Min(value = 50, message = "Systolic must be at least 50")
    @Max(value = 300, message = "Systolic must be at most 300")
    private Integer systolic;

    @NotNull(message = "Diastolic value is required")
    @Min(value = 30, message = "Diastolic must be at least 30")
    @Max(value = 200, message = "Diastolic must be at most 200")
    private Integer diastolic;

    @NotBlank(message = "Time of day is required (MORNING or NIGHT)")
    private String timeOfDay;

    @NotBlank(message = "Reading date is required")
    private String readingDate;

    @Min(value = 30, message = "Heart rate must be at least 30")
    @Max(value = 240, message = "Heart rate must be at most 240")
    private Integer heartRate;

    @Min(value = 40, message = "Blood sugar must be at least 40")
    @Max(value = 600, message = "Blood sugar must be at most 600")
    private Integer bloodSugar;

    @Min(value = 50, message = "Oxygen saturation must be at least 50")
    @Max(value = 100, message = "Oxygen saturation must be at most 100")
    private Integer oxygenSaturation;

    @Min(value = 90, message = "Body temperature must be at least 90")
    @Max(value = 115, message = "Body temperature must be at most 115")
    private Double bodyTemperature;

    @Min(value = 1, message = "Weight must be at least 1")
    @Max(value = 500, message = "Weight must be at most 500")
    private Double weightKg;

    @Size(max = 1000, message = "Notes must be at most 1000 characters")
    private String notes;

    @Size(max = 1000, message = "Symptoms must be at most 1000 characters")
    private String symptoms;

    public BpReadingRequest() {
    }

    public BpReadingRequest(Integer systolic, Integer diastolic, String timeOfDay, String readingDate,
            Integer heartRate, Integer bloodSugar, Integer oxygenSaturation, Double bodyTemperature, Double weightKg,
            String notes) {
        this.systolic = systolic;
        this.diastolic = diastolic;
        this.timeOfDay = timeOfDay;
        this.readingDate = readingDate;
        this.heartRate = heartRate;
        this.bloodSugar = bloodSugar;
        this.oxygenSaturation = oxygenSaturation;
        this.bodyTemperature = bodyTemperature;
        this.weightKg = weightKg;
        this.notes = notes;
    }

    public Integer getSystolic() {
        return systolic;
    }

    public void setSystolic(Integer systolic) {
        this.systolic = systolic;
    }

    public Integer getDiastolic() {
        return diastolic;
    }

    public void setDiastolic(Integer diastolic) {
        this.diastolic = diastolic;
    }

    public String getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(String timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public String getReadingDate() {
        return readingDate;
    }

    public void setReadingDate(String readingDate) {
        this.readingDate = readingDate;
    }

    public Integer getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }

    public Integer getBloodSugar() {
        return bloodSugar;
    }

    public void setBloodSugar(Integer bloodSugar) {
        this.bloodSugar = bloodSugar;
    }

    public Integer getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(Integer oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public Double getBodyTemperature() {
        return bodyTemperature;
    }

    public void setBodyTemperature(Double bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}
