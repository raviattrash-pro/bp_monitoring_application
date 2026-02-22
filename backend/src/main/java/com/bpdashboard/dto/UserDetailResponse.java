package com.bpdashboard.dto;

import java.util.List;

public class UserDetailResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String createdAt;
    private long readingCount;
    private String lastReadingDate;
    private Integer lastSystolic;
    private Integer lastDiastolic;
    private String bpStatus;
    private List<BpReadingResponse> readings;

    public UserDetailResponse() {
    }

    public UserDetailResponse(Long id, String name, String email, String role, String createdAt, long readingCount,
            String lastReadingDate, Integer lastSystolic, Integer lastDiastolic, String bpStatus,
            List<BpReadingResponse> readings) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.readingCount = readingCount;
        this.lastReadingDate = lastReadingDate;
        this.lastSystolic = lastSystolic;
        this.lastDiastolic = lastDiastolic;
        this.bpStatus = bpStatus;
        this.readings = readings;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public long getReadingCount() {
        return readingCount;
    }

    public void setReadingCount(long readingCount) {
        this.readingCount = readingCount;
    }

    public String getLastReadingDate() {
        return lastReadingDate;
    }

    public void setLastReadingDate(String lastReadingDate) {
        this.lastReadingDate = lastReadingDate;
    }

    public Integer getLastSystolic() {
        return lastSystolic;
    }

    public void setLastSystolic(Integer lastSystolic) {
        this.lastSystolic = lastSystolic;
    }

    public Integer getLastDiastolic() {
        return lastDiastolic;
    }

    public void setLastDiastolic(Integer lastDiastolic) {
        this.lastDiastolic = lastDiastolic;
    }

    public String getBpStatus() {
        return bpStatus;
    }

    public void setBpStatus(String bpStatus) {
        this.bpStatus = bpStatus;
    }

    public List<BpReadingResponse> getReadings() {
        return readings;
    }

    public void setReadings(List<BpReadingResponse> readings) {
        this.readings = readings;
    }

    public static UserDetailResponseBuilder builder() {
        return new UserDetailResponseBuilder();
    }

    public static class UserDetailResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String createdAt;
        private long readingCount;
        private String lastReadingDate;
        private Integer lastSystolic;
        private Integer lastDiastolic;
        private String bpStatus;
        private List<BpReadingResponse> readings;

        public UserDetailResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDetailResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserDetailResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDetailResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserDetailResponseBuilder createdAt(String createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserDetailResponseBuilder readingCount(long readingCount) {
            this.readingCount = readingCount;
            return this;
        }

        public UserDetailResponseBuilder lastReadingDate(String lastReadingDate) {
            this.lastReadingDate = lastReadingDate;
            return this;
        }

        public UserDetailResponseBuilder lastSystolic(Integer lastSystolic) {
            this.lastSystolic = lastSystolic;
            return this;
        }

        public UserDetailResponseBuilder lastDiastolic(Integer lastDiastolic) {
            this.lastDiastolic = lastDiastolic;
            return this;
        }

        public UserDetailResponseBuilder bpStatus(String bpStatus) {
            this.bpStatus = bpStatus;
            return this;
        }

        public UserDetailResponseBuilder readings(List<BpReadingResponse> readings) {
            this.readings = readings;
            return this;
        }

        public UserDetailResponse build() {
            return new UserDetailResponse(id, name, email, role, createdAt, readingCount, lastReadingDate, lastSystolic,
                    lastDiastolic, bpStatus, readings);
        }
    }
}
