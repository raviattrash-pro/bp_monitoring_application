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

    public BpReading(Long id, Integer systolic, Integer diastolic, TimeOfDay timeOfDay, LocalDate readingDate,
            User user) {
        this.id = id;
        this.systolic = systolic;
        this.diastolic = diastolic;
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
            return new BpReading(id, systolic, diastolic, timeOfDay, readingDate, user);
        }
    }
}
