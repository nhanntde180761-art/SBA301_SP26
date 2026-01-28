package fu.se.chapter12demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"fu.se.chapter12demo.controllers", "fu.se.chapter12demo.services", "fu.se.chapter12demo.repositories"})
public class Chapter12demoApplication {

	public static void main(String[] args) {
		SpringApplication.run(Chapter12demoApplication.class, args);
	}

}
