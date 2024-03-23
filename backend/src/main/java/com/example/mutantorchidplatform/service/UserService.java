package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.UserDTO;
import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.entity.Shipment;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.entity.enums.UserStatus;
import com.example.mutantorchidplatform.repository.RoleRepository;
import com.example.mutantorchidplatform.repository.UserRepository;
import jakarta.persistence.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


public interface UserService {

    User createUser(UserDTO userDTO);
    UserDTO getUser(int id);
    User getUserById(int id);
    void updateUser(UserDTO userDTO);
    void deleteUser(int id);

    List<UserDTO> getAllUser();
}

@Service
class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private  RoleRepository roleRepository;


    @Override
    @Transactional
    public User createUser(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);

        if (userDTO.getRole() == null) {
            Role role = roleRepository.findById(2).orElseThrow(NoResultException::new);
            user.setRole(role);
        }
        return userRepository.save(user);
    }

    @Override
    public UserDTO getUser(int id) {
        User user =userRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id).orElseThrow(NoResultException::new);
    }

    @Override
    @Transactional
    public void updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId()).orElseThrow(NoResultException::new);
        if (userDTO.getRole() != null) {
            Role role = roleRepository.findById(userDTO.getRole().getId()).orElseThrow(NoResultException::new);
            user.setRole(role);
        }
        user.setAbout(userDTO.getAbout());
        user.setAddress(userDTO.getAddress());
        user.setCity(userDTO.getCity());
        user.setCompany(userDTO.getCompany());
        user.setCountry(userDTO.getCountry());
        user.setDisplayName(userDTO.getDisplayName());
        user.setPassword(userDTO.getPassword());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setPhotoURL(userDTO.getPhotoURL());
        user.setDefaultShipmentId(userDTO.getDefaultShipmentId());
        user.setState(userDTO.getState());
        user.setZipCode(userDTO.getZipCode());
        userRepository.save(user);
    }


    @Override
    @Transactional
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> getAllUser() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userEntity = userRepository.findByEmail(email);
        if(userEntity == null){
            throw new UsernameNotFoundException("not Found");
        }
        //convert userentity -> userdetails
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        //chuyen vai tro ve quyen
            authorities.add(new SimpleGrantedAuthority(userEntity.getRole().getName().toString()));
        return new org.springframework.security.core.userdetails.User(email,
                userEntity.getPassword(), authorities);
    }
}