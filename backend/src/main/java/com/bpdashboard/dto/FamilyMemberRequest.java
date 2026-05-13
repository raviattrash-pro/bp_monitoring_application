package com.bpdashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FamilyMemberRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 120)
    private String name;
    @Size(max = 80)
    private String relation;
    private Integer age;
    @Size(max = 10)
    private String bloodGroup;
    @Size(max = 1000)
    private String conditions;
    @Size(max = 1000)
    private String medications;
    @Size(max = 1000)
    private String notes;

    public FamilyMemberRequest() {
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
