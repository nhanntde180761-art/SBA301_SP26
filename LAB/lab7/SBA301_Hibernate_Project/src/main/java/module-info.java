module SBA301.Hibernate.Project {
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires java.naming;
    opens sba301.fu.SBA301_Hibernate_Project.pojo to org.hibernate.orm.core, javafx.base;
    exports sba301.fu.SBA301_Hibernate_Project.pojo;
    exports sba301.fu.SBA301_Hibernate_Project.service;
}