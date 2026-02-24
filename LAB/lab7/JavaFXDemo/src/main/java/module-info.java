module sba301.fe.javafxdemo {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.base;
    requires SBA301.Hibernate.Project; // Tên này phải khớp với module-info bên kia

    opens sba301.fe.javafxdemo to javafx.fxml;
    exports sba301.fe.javafxdemo;
}