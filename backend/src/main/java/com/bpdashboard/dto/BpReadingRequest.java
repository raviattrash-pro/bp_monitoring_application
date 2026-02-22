package com.bpdashboard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    public BpReadingRequest() {
    }

    public BpReadingRequest(Integer systolic, Integer diastolic, String timeOfDay, String readingDate) {
        this.systolic = systolic;
        this.diastolic = diastolic;
        this.timeOfDay = timeOfDay;
        this.readingDate = readingDate;
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
}
