package com.bpdashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "medications")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String dosage;

    @Column(length = 120)
    private String frequency;

    @Column(name = "time_schedule", length = 120)
    private String timeSchedule;

    @Column(length = 1000)
    private String instructions;

    @Column(name = "remaining_count")
    private Integer remainingCount;

    @Column(name = "refill_threshold")
    private Integer refillThreshold;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Medication() {
    }

    public Medication(Long id, String name, String dosage, String frequency, String timeSchedule, String instructions,
            Integer remainingCount, Integer refillThreshold, LocalDate startDate, LocalDate endDate, Boolean active,
            User user) {
        this.id = id;
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.timeSchedule = timeSchedule;
        this.instructions = instructions;
        this.remainingCount = remainingCount;
        this.refillThreshold = refillThreshold;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active != null ? active : true;
        this.user = user;
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
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static MedicationBuilder builder() {
        return new MedicationBuilder();
    }

    public static class MedicationBuilder {
        private Long id;
        private String name;
        private String dosage;
        private String frequency;
        private String timeSchedule;
        private String instructions;
        private Integer remainingCount;
        private Integer refillThreshold;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean active;
        private User user;

        public MedicationBuilder id(Long id) { this.id = id; return this; }
        public MedicationBuilder name(String name) { this.name = name; return this; }
        public MedicationBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public MedicationBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public MedicationBuilder timeSchedule(String timeSchedule) { this.timeSchedule = timeSchedule; return this; }
        public MedicationBuilder instructions(String instructions) { this.instructions = instructions; return this; }
        public MedicationBuilder remainingCount(Integer remainingCount) { this.remainingCount = remainingCount; return this; }
        public MedicationBuilder refillThreshold(Integer refillThreshold) { this.refillThreshold = refillThreshold; return this; }
        public MedicationBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public MedicationBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public MedicationBuilder active(Boolean active) { this.active = active; return this; }
        public MedicationBuilder user(User user) { this.user = user; return this; }

        public Medication build() {
            return new Medication(id, name, dosage, frequency, timeSchedule, instructions, remainingCount,
                    refillThreshold, startDate, endDate, active, user);
        }
    }
}
