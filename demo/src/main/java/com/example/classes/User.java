package com.example.classes;


import com.example.enums.Admin;
import com.example.interfaces.Person;

import java.io.Serializable;

public class User implements Serializable, Person {
    private String username;
    private String password;
    private Admin admin;
    private String department;

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Admin getAdmin() {
        return this.admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getDepartment() {
        return this.department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
    
}
