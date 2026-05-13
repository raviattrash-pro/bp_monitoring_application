package com.bpdashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LabReportRequest {
    @NotBlank(message = "Test name is required")
    @Size(max = 120)
    private String testName;
    @Size(max = 80)
    private String resultValue;
    @Size(max = 20)
    private String unit;
    @Size(max = 80)
    private String normalRange;
    @NotBlank(message = "Report date is required")
    private String reportDate;
    @Size(max = 120)
    private String labName;
    @Size(max = 80)
    private String category;
    @Size(max = 1000)
    private String notes;

    public LabReportRequest() {
    }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getResultValue() { return resultValue; }
    public void setResultValue(String resultValue) { this.resultValue = resultValue; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getNormalRange() { return normalRange; }
    public void setNormalRange(String normalRange) { this.normalRange = normalRange; }
    public String getReportDate() { return reportDate; }
    public void setReportDate(String reportDate) { this.reportDate = reportDate; }
    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
