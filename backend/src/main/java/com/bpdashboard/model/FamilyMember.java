package com.bpdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "family_members")
public class FamilyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 80)
    private String relation;

    private Integer age;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(length = 1000)
    private String conditions;

    @Column(length = 1000)
    private String medications;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public FamilyMember() {
    }

    public FamilyMember(Long id, String name, String relation, Integer age, String bloodGroup, String conditions,
            String medications, String notes, User user) {
        this.id = id;
        this.name = name;
        this.relation = relation;
        this.age = age;
        this.bloodGroup = bloodGroup;
        this.conditions = conditions;
        this.medications = medications;
        this.notes = notes;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static FamilyMemberBuilder builder() { return new FamilyMemberBuilder(); }

    public static class FamilyMemberBuilder {
        private Long id;
        private String name;
        private String relation;
        private Integer age;
        private String bloodGroup;
        private String conditions;
        private String medications;
        private String notes;
        private User user;

        public FamilyMemberBuilder id(Long id) { this.id = id; return this; }
        public FamilyMemberBuilder name(String name) { this.name = name; return this; }
        public FamilyMemberBuilder relation(String relation) { this.relation = relation; return this; }
        public FamilyMemberBuilder age(Integer age) { this.age = age; return this; }
        public FamilyMemberBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public FamilyMemberBuilder conditions(String conditions) { this.conditions = conditions; return this; }
        public FamilyMemberBuilder medications(String medications) { this.medications = medications; return this; }
        public FamilyMemberBuilder notes(String notes) { this.notes = notes; return this; }
        public FamilyMemberBuilder user(User user) { this.user = user; return this; }

        public FamilyMember build() {
            return new FamilyMember(id, name, relation, age, bloodGroup, conditions, medications, notes, user);
        }
    }
}
