package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.dto.TaskDTO;
import com.example.mutantorchidplatform.entity.Task;
import com.example.mutantorchidplatform.repository.TaskRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

public interface TaskService {

    void create(TaskDTO taskDTO);

    TaskDTO getById(int id);

    void update(TaskDTO taskDTO);

    void delete(int id);

    PageDTO<TaskDTO> search(SearchDTO searchDTO);

}

@Service
class TaskServiceImpl implements TaskService{

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TaskRepository taskRepository;

    @Override
    @Transactional
    public void create(TaskDTO taskDTO) {
        taskRepository.save(modelMapper.map(taskDTO, Task.class));
    }

    @Override
    public TaskDTO getById(int id) {
        Task task = taskRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(task, TaskDTO.class);
    }

    @Override
    @Transactional
    public void update(TaskDTO taskDTO) {
        taskRepository.findById(taskDTO.getId()).orElseThrow(NoResultException::new);
        taskRepository.save(modelMapper.map(taskDTO, Task.class));

    }

    @Override
    @Transactional
    public void delete(int id) {
        taskRepository.deleteById(id);
    }


    @Override
    public PageDTO<TaskDTO> search(SearchDTO searchDTO) {
        Sort sortBy = Sort.by("createdAt").descending();

        if (StringUtils.hasText(searchDTO.getSortedField())) {
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();
        }

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Task> taskPage = taskRepository.findAll(pageRequest);
        return PageDTO.<TaskDTO>builder()
                .totalPages(taskPage.getTotalPages())
                .totalElements(taskPage.getTotalElements())
                .contents(taskPage.get().map(this::convertToTaskDTO).collect(Collectors.toList()))
                .build();
    }

    private TaskDTO convertToTaskDTO(Task task) {
        return modelMapper.map(task, TaskDTO.class);
    }
}
