package fu.se.chapter15api.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorDetail {
    private LocalDateTime timestamp;
    private String message;
    private String details;
}