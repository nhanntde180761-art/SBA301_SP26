package fu.se.chapter15api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({ "fu.se.chapter15api.controllers", "fu.se.chapter15api.services" })
@EnableJpaRepositories(basePackages = "fu.se.chapter15api.repositories")
@EntityScan(basePackages = "fu.se.chapter15api.pojos")
public class Chapter15ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(Chapter15ApiApplication.class, args);
	}

}
