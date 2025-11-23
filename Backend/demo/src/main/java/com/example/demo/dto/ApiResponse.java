package com.example.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
}
