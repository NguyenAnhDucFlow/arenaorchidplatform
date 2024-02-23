package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.RoleDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.repository.RoleRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

public interface RoleService {

    void createRole(RoleDTO roleDTO);
    RoleDTO getRole(int id);
    void updateRole(RoleDTO roleDTO);
    void deleteRole(int id);
    PageDTO<RoleDTO> search(SearchDTO searchDTO);
}

@Service
class RoleServiceImpl implements RoleService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    @Transactional
    public void createRole(RoleDTO roleDTO) {
        Role role = modelMapper.map(roleDTO, Role.class);
        roleRepository.save(role);
    }

    @Override
    public RoleDTO getRole(int id) {
        Role role = roleRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(role, RoleDTO.class);

    }

    @Override
    @Transactional
    public void updateRole(RoleDTO roleDTO) {
        Role role = roleRepository.findById(roleDTO.getId()).orElseThrow(NoResultException::new);
        role.setName(roleDTO.getName());
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(int id) {
        roleRepository.deleteById(id);
    }

    @Override
    public PageDTO<RoleDTO> search(SearchDTO searchDTO) {

        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());
        Page<Role> rolePage = roleRepository.searchByName("%" + searchDTO.getKeyword() + "%", pageable);
        return PageDTO.<RoleDTO>builder()
                .totalPages(rolePage.getTotalPages())
                .totalElements(rolePage.getTotalElements())
                .contents(rolePage.get().map(this::convertToRoleDTO).collect(Collectors.toList()))
                .build();
    }

    private RoleDTO convertToRoleDTO(Role role) {
        return modelMapper.map(role, RoleDTO.class);
    }
}