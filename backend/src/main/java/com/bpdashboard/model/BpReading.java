package com.bpdashboard.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bp_readings")
public class BpReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer systolic;

    @Column(nullable = false)
    private Integer diastolic;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "blood_sugar")
    private Integer bloodSugar;

    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation;

    @Column(name = "body_temperature")
    private Double bodyTemperature;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(length = 1000)
    private String notes;

    @Column(length = 1000)
    private String symptoms;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_of_day", nullable = false)
    private TimeOfDay timeOfDay;

    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum TimeOfDay {
        MORNING, NIGHT
    }

    public BpReading() {
    }

    public BpReading(Long id, Integer systolic, Integer diastolic, Integer heartRate, Integer bloodSugar,
            Integer oxygenSaturation, Double bodyTemperature, Double weightKg, String notes, String symptoms, TimeOfDay timeOfDay,
            LocalDate readingDate, User user) {
        this.id = id;
        this.systolic = systolic;
        this.diastolic = diastolic;
        this.heartRate = heartRate;
        this.bloodSugar = bloodSugar;
        this.oxygenSaturation = oxygenSaturation;
        this.bodyTemperature = bodyTemperature;
        this.weightKg = weightKg;
        this.notes = notes;
        this.symptoms = symptoms;
        this.timeOfDay = timeOfDay;
        this.readingDate = readingDate;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TimeOfDay getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(TimeOfDay timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public LocalDate getReadingDate() {
        return readingDate;
    }

    public void setReadingDate(LocalDate readingDate) {
        this.readingDate = readingDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Manual Builder
    public static BpReadingBuilder builder() {
        return new BpReadingBuilder();
    }

    public static class BpReadingBuilder {
        private Long id;
        private Integer systolic;
        private Integer diastolic;
        private Integer heartRate;
        private Integer bloodSugar;
        private Integer oxygenSaturation;
        private Double bodyTemperature;
        private Double weightKg;
        private String notes;
        private String symptoms;
        private TimeOfDay timeOfDay;
        private LocalDate readingDate;
        private User user;

        public BpReadingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BpReadingBuilder systolic(Integer systolic) {
            this.systolic = systolic;
            return this;
        }

        public BpReadingBuilder diastolic(Integer diastolic) {
            this.diastolic = diastolic;
            return this;
        }

        public BpReadingBuilder heartRate(Integer heartRate) {
            this.heartRate = heartRate;
            return this;
        }

        public BpReadingBuilder bloodSugar(Integer bloodSugar) {
            this.bloodSugar = bloodSugar;
            return this;
        }

        public BpReadingBuilder oxygenSaturation(Integer oxygenSaturation) {
            this.oxygenSaturation = oxygenSaturation;
            return this;
        }

        public BpReadingBuilder bodyTemperature(Double bodyTemperature) {
            this.bodyTemperature = bodyTemperature;
            return this;
        }

        public BpReadingBuilder weightKg(Double weightKg) {
            this.weightKg = weightKg;
            return this;
        }

        public BpReadingBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BpReadingBuilder symptoms(String symptoms) {
            this.symptoms = symptoms;
            return this;
        }

        public BpReadingBuilder timeOfDay(TimeOfDay timeOfDay) {
            this.timeOfDay = timeOfDay;
            return this;
        }

        public BpReadingBuilder readingDate(LocalDate readingDate) {
            this.readingDate = readingDate;
            return this;
        }

        public BpReadingBuilder user(User user) {
            this.user = user;
            return this;
        }

        public BpReading build() {
            return new BpReading(id, systolic, diastolic, heartRate, bloodSugar, oxygenSaturation, bodyTemperature,
                    weightKg, notes, symptoms, timeOfDay, readingDate, user);
        }
    }
}
