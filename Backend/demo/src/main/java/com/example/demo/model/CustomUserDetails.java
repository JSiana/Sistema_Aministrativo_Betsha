package com.example.demo.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final Usuarios usuario;

    public CustomUserDetails(Usuarios usuario){
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return Collections.singleton(
                new SimpleGrantedAuthority("Role_" + usuario.getRol().getNombreRol())
        );
    }

    @Override
    public String getPassword(){
        return usuario.getContrasenia();
    }

    @Override
    public String getUsername(){
        return usuario.getUsuario();
    }

    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    @Override
    public boolean isAccountNonLocked(){
        return usuario.getFechaBloqueo() == null;
    }

    @Override
    public boolean isCredentialsNonExpired(){
        return true;
    }

    @Override
    public boolean isEnabled() {
        return usuario.getEstado();
    }

    public Usuarios getUsuarioOriginal(){
        return usuario;
    }
}
