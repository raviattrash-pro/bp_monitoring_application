package com.bpdashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MedicationRequest {
    @NotBlank(message = "Medication name is required")
    @Size(max = 150)
    private String name;
    @Size(max = 100)
    private String dosage;
    @Size(max = 120)
    private String frequency;
    @Size(max = 120)
    private String timeSchedule;
    @Size(max = 1000)
    private String instructions;
    private Integer remainingCount;
    private Integer refillThreshold;
    private String startDate;
    private String endDate;
    private Boolean active;

    public MedicationRequest() {
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getTimeSchedule() { return timeSchedule; }
    public void setTimeSchedule(String timeSchedule) { this.timeSchedule = timeSchedule; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public Integer getRemainingCount() { return remainingCount; }
    public void setRemainingCount(Integer remainingCount) { this.remainingCount = remainingCount; }
    public Integer getRefillThreshold() { return refillThreshold; }
    public void setRefillThreshold(Integer refillThreshold) { this.refillThreshold = refillThreshold; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
