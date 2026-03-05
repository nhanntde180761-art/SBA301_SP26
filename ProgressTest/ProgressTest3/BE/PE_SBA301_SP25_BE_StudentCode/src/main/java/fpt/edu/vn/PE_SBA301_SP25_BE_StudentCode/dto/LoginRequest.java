package fpt.edu.vn.PE_SBA301_SP25_BE_StudentCode.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
}
