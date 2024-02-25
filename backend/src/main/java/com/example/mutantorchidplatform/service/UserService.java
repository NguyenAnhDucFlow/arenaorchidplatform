package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.UserDTO;
import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.repository.RoleRepository;
import com.example.mutantorchidplatform.repository.UserRepository;
import jakarta.persistence.NoResultException;
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
    UserDTO getUser(Long id);
    void updateUser(UserDTO userDTO);
    void deleteUser(Long id);

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
        Set<Role> roles = roleRepository.searchByID(2);
        user.setRoles(roles);
        return userRepository.save(user);

    }

    @Override
    public UserDTO getUser(Long id) {
        User user =userRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(user, UserDTO.class);
    }




    @Override
    @Transactional
    public void updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId()).orElseThrow(NoResultException::new);
        modelMapper.map(userDTO, User.class);
        user.setRoles(userDTO.getRoles().stream().map(role -> roleRepository.findById(role.getId()).orElse(null))
                .filter(r -> r != null).collect(Collectors.toSet()));

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
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
        for(Role role : userEntity.getRoles()){
            authorities.add(new SimpleGrantedAuthority(role.getName().toString()));
        }
        return new org.springframework.security.core.userdetails.User(email,
                userEntity.getPassword(), authorities);
    }
}