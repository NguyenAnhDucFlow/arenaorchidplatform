package com.example.mutantorchidplatform.config;

import com.example.mutantorchidplatform.dto.UserDTO;
import com.example.mutantorchidplatform.entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@Configuration
@EnableJpaAuditing
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
//         Bỏ qua thuộc tính 'password' khi chuyển đổi từ 'User' sang 'UserDTO'
        modelMapper.typeMap(User.class, UserDTO.class).addMappings(mapper -> {
            mapper.skip(UserDTO::setPassword);
        });
        return modelMapper;
    }
}