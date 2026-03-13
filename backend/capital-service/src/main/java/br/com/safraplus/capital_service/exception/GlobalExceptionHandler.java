package br.com.safraplus.capital_service.exception;

import br.com.safraplus.capital_service.dto.error.FieldErrorDetail;
import br.com.safraplus.capital_service.dto.error.ValidationErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex){
        List<FieldErrorDetail> fieldErrors = new ArrayList<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.add(new FieldErrorDetail(error.getField(), error.getDefaultMessage()));
        }

        return new ValidationErrorResponse("Validation failed", fieldErrors);
    }
}
