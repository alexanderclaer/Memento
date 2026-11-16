package com.memento.backend.model.valueObjects;

//Clase auxiliar para representar los límites de una nota en el espacio de trabajo
public class Bounds {
    private double x;
    private double y;
    private double width;
    private double height;

    // Constructors
    public Bounds() {
    }

    public Bounds(double x, double y, double width, double height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public Bounds(Bounds other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    }

    // Getters and Setters
    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }
}
