package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.OrderDTO;
import com.example.mutantorchidplatform.dto.OrderDetailDTO;
import com.example.mutantorchidplatform.dto.PageDTO;
import com.example.mutantorchidplatform.dto.SearchDTO;
import com.example.mutantorchidplatform.entity.Order;
import com.example.mutantorchidplatform.entity.OrderDetail;
import com.example.mutantorchidplatform.entity.User;
import com.example.mutantorchidplatform.repository.OrderRepository;
import com.example.mutantorchidplatform.repository.ProductRepository;
import com.example.mutantorchidplatform.repository.UserRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface OrderService {

    void create(OrderDTO orderDTO);

    OrderDTO getById(int id);

    void update(OrderDTO orderDTO);

    void delete(int id);

    PageDTO<OrderDTO> search(SearchDTO searchDTO);
}
@Service
class OrderServiceImpl implements OrderService {


    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;


    @Override
    @Transactional
    public void create(OrderDTO orderDTO) {

        User user = userRepository.findById(orderDTO.getCustomer().getId()).orElseThrow(NoResultException::new);
        Order order = new Order();
        order.setCustomer(user);
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(
                    productRepository.findById(orderDetailDTO.getProduct().getId()).orElseThrow(NoResultException::new));
            orderDetail.setPrice(orderDetailDTO.getPrice());
            orderDetail.setQuantity(orderDetailDTO.getQuantity());
            orderDetails.add(orderDetail);
       }
        order.setOrderDetails(orderDetails);
        orderRepository.save(order);
        orderDTO.setId(order.getId());
        orderDTO.getCustomer().setEmail(order.getCustomer().getEmail());
    }

    @Override
    public OrderDTO getById(int id) {

        Order order = orderRepository.findById(id).orElseThrow(NoResultException::new);
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    @Transactional
    public void update(OrderDTO orderDTO) {

        User user = userRepository.findById(orderDTO.getCustomer().getId()).orElseThrow(NoResultException::new);

        Order order = orderRepository.findById(orderDTO.getId()).orElseThrow(NoResultException::new);
        order.setCustomer(user);

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void delete(int id) {
        orderRepository.deleteById(id);
    }

    @Override
    public PageDTO<OrderDTO> search(SearchDTO searchDTO) {

        Sort sortBy = Sort.by("date").descending();

        if (StringUtils.hasText(searchDTO.getSortedField()))
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();

        if (searchDTO.getCurrentPage() == null)
            searchDTO.setCurrentPage(0);

        if (searchDTO.getSize() == null)
            searchDTO.setSize(5);

        if (searchDTO.getKeyword() == null)
            searchDTO.setKeyword("");

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Order> orderPage = orderRepository.findAll(pageRequest);
        return PageDTO.<OrderDTO>builder()
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .contents(orderPage.get().map(this::convertToOrderDTO).collect(Collectors.toList()))
                .build();
    }

    private OrderDTO convertToOrderDTO(Order order) {

        return modelMapper.map(order, OrderDTO.class);
    }
}

