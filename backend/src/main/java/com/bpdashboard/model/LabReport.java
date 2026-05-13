package com.bpdashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "lab_reports")
public class LabReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_name", nullable = false, length = 120)
    private String testName;

    @Column(name = "result_value", length = 80)
    private String resultValue;

    @Column(length = 20)
    private String unit;

    @Column(name = "normal_range", length = 80)
    private String normalRange;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "lab_name", length = 120)
    private String labName;

    @Column(length = 80)
    private String category;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public LabReport() {
    }

    public LabReport(Long id, String testName, String resultValue, String unit, String normalRange, LocalDate reportDate,
            String labName, String category, String notes, User user) {
        this.id = id;
        this.testName = testName;
        this.resultValue = resultValue;
        this.unit = unit;
        this.normalRange = normalRange;
        this.reportDate = reportDate;
        this.labName = labName;
        this.category = category;
        this.notes = notes;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getResultValue() { return resultValue; }
    public void setResultValue(String resultValue) { this.resultValue = resultValue; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getNormalRange() { return normalRange; }
    public void setNormalRange(String normalRange) { this.normalRange = normalRange; }
    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static LabReportBuilder builder() { return new LabReportBuilder(); }

    public static class LabReportBuilder {
        private Long id;
        private String testName;
        private String resultValue;
        private String unit;
        private String normalRange;
        private LocalDate reportDate;
        private String labName;
        private String category;
        private String notes;
        private User user;

        public LabReportBuilder id(Long id) { this.id = id; return this; }
        public LabReportBuilder testName(String testName) { this.testName = testName; return this; }
        public LabReportBuilder resultValue(String resultValue) { this.resultValue = resultValue; return this; }
        public LabReportBuilder unit(String unit) { this.unit = unit; return this; }
        public LabReportBuilder normalRange(String normalRange) { this.normalRange = normalRange; return this; }
        public LabReportBuilder reportDate(LocalDate reportDate) { this.reportDate = reportDate; return this; }
        public LabReportBuilder labName(String labName) { this.labName = labName; return this; }
        public LabReportBuilder category(String category) { this.category = category; return this; }
        public LabReportBuilder notes(String notes) { this.notes = notes; return this; }
        public LabReportBuilder user(User user) { this.user = user; return this; }

        public LabReport build() {
            return new LabReport(id, testName, resultValue, unit, normalRange, reportDate, labName, category, notes,
                    user);
        }
    }
}
