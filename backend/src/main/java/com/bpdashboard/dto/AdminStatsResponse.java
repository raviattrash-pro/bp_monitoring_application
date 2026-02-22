package com.bpdashboard.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalReadings;
    private double avgSystolic;
    private double avgDiastolic;
    private long usersWithHighBp;
    private long readingsToday;
    private long newUsersThisWeek;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalReadings, double avgSystolic, double avgDiastolic,
            long usersWithHighBp, long readingsToday, long newUsersThisWeek) {
        this.totalUsers = totalUsers;
        this.totalReadings = totalReadings;
        this.avgSystolic = avgSystolic;
        this.avgDiastolic = avgDiastolic;
        this.usersWithHighBp = usersWithHighBp;
        this.readingsToday = readingsToday;
        this.newUsersThisWeek = newUsersThisWeek;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalReadings() {
        return totalReadings;
    }

    public void setTotalReadings(long totalReadings) {
        this.totalReadings = totalReadings;
    }

    public double getAvgSystolic() {
        return avgSystolic;
    }

    public void setAvgSystolic(double avgSystolic) {
        this.avgSystolic = avgSystolic;
    }

    public double getAvgDiastolic() {
        return avgDiastolic;
    }

    public void setAvgDiastolic(double avgDiastolic) {
        this.avgDiastolic = avgDiastolic;
    }

    public long getUsersWithHighBp() {
        return usersWithHighBp;
    }

    public void setUsersWithHighBp(long usersWithHighBp) {
        this.usersWithHighBp = usersWithHighBp;
    }

    public long getReadingsToday() {
        return readingsToday;
    }

    public void setReadingsToday(long readingsToday) {
        this.readingsToday = readingsToday;
    }

    public long getNewUsersThisWeek() {
        return newUsersThisWeek;
    }

    public void setNewUsersThisWeek(long newUsersThisWeek) {
        this.newUsersThisWeek = newUsersThisWeek;
    }

    public static AdminStatsResponseBuilder builder() {
        return new AdminStatsResponseBuilder();
    }

    public static class AdminStatsResponseBuilder {
        private long totalUsers;
        private long totalReadings;
        private double avgSystolic;
        private double avgDiastolic;
        private long usersWithHighBp;
        private long readingsToday;
        private long newUsersThisWeek;

        public AdminStatsResponseBuilder totalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public AdminStatsResponseBuilder totalReadings(long totalReadings) {
            this.totalReadings = totalReadings;
            return this;
        }

        public AdminStatsResponseBuilder avgSystolic(double avgSystolic) {
            this.avgSystolic = avgSystolic;
            return this;
        }

        public AdminStatsResponseBuilder avgDiastolic(double avgDiastolic) {
            this.avgDiastolic = avgDiastolic;
            return this;
        }

        public AdminStatsResponseBuilder usersWithHighBp(long usersWithHighBp) {
            this.usersWithHighBp = usersWithHighBp;
            return this;
        }

        public AdminStatsResponseBuilder readingsToday(long readingsToday) {
            this.readingsToday = readingsToday;
            return this;
        }

        public AdminStatsResponseBuilder newUsersThisWeek(long newUsersThisWeek) {
            this.newUsersThisWeek = newUsersThisWeek;
            return this;
        }

        public AdminStatsResponse build() {
            return new AdminStatsResponse(totalUsers, totalReadings, avgSystolic, avgDiastolic, usersWithHighBp,
                    readingsToday, newUsersThisWeek);
        }
    }
}
