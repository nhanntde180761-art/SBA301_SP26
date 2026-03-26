package com.quokka.jobmate_connect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableScheduling
@EnableFeignClients
@OpenAPIDefinition(info = @Info(title = "JobMate Connect API", version = "1.0", description = "Core service for job matching and user management"))
public class JobmateConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobmateConnectApplication.class, args);
	}

}
