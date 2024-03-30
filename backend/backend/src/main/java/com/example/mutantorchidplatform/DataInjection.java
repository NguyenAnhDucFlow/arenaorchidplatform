package com.example.mutantorchidplatform;

import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.entity.enums.UserStatus;
import com.example.mutantorchidplatform.repository.RoleRepository;
import com.example.mutantorchidplatform.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class DataInjection implements ApplicationRunner {

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	UserRepository userRepository;

	@Override
	public void run(ApplicationArguments args) throws Exception {

		// insert list role
		List<String> roleNames = Arrays.asList("Admin", "Customer", "Product Owners","Manager", "Staff");
		for (String roleName: roleNames) {
			Role existingRole = roleRepository.findByName(roleName);
			if (existingRole == null) {
				Role role = new Role();
				role.setName(roleName);
				roleRepository.save(role);
			}
		}

		// insert account admin
		Role adminRole = roleRepository.findByName("Admin");
		if (adminRole != null) {
			User existingUser = userRepository.findByEmail("admin@gmail.com");
			if (existingUser == null) {
				User userAdmin = new User();
				userAdmin.setDisplayName("SYS Admin");
				userAdmin.setEmail("admin@gmail.com");
				userAdmin.setPassword("admin@gmail.com");
				userAdmin.setRole(adminRole);
				userAdmin.setStatus(UserStatus.ACTIVE);
				userRepository.save(userAdmin);
			}
		}

	}

}
