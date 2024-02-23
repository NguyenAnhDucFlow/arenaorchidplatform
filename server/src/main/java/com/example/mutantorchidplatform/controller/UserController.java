package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.UserDTO;
import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.jwt.JwtTokenService;
import com.example.mutantorchidplatform.repository.UserRepository;
import com.example.mutantorchidplatform.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    JwtTokenService jwtTokenService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthenticationManager authenticationManager;


    private final String UPLOAD_FOLDER = "D:/arenaorchid/user/";

    @PostMapping("/register")
    public ResponseDTO<JwtTokenService.TokenAndUser> createUser(@ModelAttribute @Valid UserDTO userDTO) throws IOException {

        if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
            if (!(new File(UPLOAD_FOLDER).exists())) {
                new File(UPLOAD_FOLDER).mkdirs();
            }
            String filename = userDTO.getFile().getOriginalFilename();
            // lay dinh dang file
            String extension = filename.substring(filename.lastIndexOf("."));
            // tao ten moi
            String newFilename = UUID.randomUUID().toString() + extension;

            File newFile = new File(UPLOAD_FOLDER + newFilename);

            userDTO.getFile().transferTo(newFile);

            userDTO.setPhotoURL(newFilename);// save to db

        }
        User user = userService.createUser(userDTO);

        List<String> authorities = new ArrayList<>();
        for(Role role : user.getRoles()){
            authorities.add(role.getName().toString());
        }

        return ResponseDTO.<JwtTokenService.TokenAndUser>builder()
                .status(200)
                .data(jwtTokenService.createToken(user.getEmail(), authorities))
                .build();
    }

    @GetMapping("/download/{filename}")
    public void download(@PathVariable("filename") String filename, HttpServletResponse response) throws IOException {
        File file = new File(UPLOAD_FOLDER + filename);
        Files.copy(file.toPath(), response.getOutputStream());
    }

    @GetMapping("/my-account")
    public ResponseDTO<Map<String, UserDTO>> getMyAccount(@RequestHeader("Authorization") String token) {
        String email = jwtTokenService.getUsername(token.replace("Bearer ", ""));
        UserDTO user = convert(userRepository.findByEmail(email));
        Map<String, UserDTO> userData = new HashMap<>();
        userData.put("user", user);
        return ResponseDTO.<Map<String, UserDTO>>builder()
                .status(200)
                .data(userData)
                .build();
    }


    private  UserDTO convert(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    @GetMapping("/{id}")
    public ResponseDTO<UserDTO> getUser(@PathVariable Long id) {
        return ResponseDTO.<UserDTO>builder()
                .status(200)
                .data(userService.getUser(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> updateUser(@ModelAttribute @Valid UserDTO userDTO) {
        userService.updateUser(userDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }
}
