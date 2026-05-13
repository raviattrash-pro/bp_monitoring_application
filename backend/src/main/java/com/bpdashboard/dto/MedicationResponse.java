package com.bpdashboard.dto;

public class MedicationResponse {
    private Long id;
    private String name;
    private String dosage;
    private String frequency;
    private String timeSchedule;
    private String instructions;
    private Integer remainingCount;
    private Integer refillThreshold;
    private String startDate;
    private String endDate;
    private Boolean active;
    private Boolean refillSoon;

    public MedicationResponse() {
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Boolean getRefillSoon() { return refillSoon; }
    public void setRefillSoon(Boolean refillSoon) { this.refillSoon = refillSoon; }
}
