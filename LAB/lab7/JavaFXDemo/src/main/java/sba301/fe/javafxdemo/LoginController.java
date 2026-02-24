package sba301.fe.javafxdemo;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import sba301.fu.SBA301_Hibernate_Project.pojo.Student;
import sba301.fu.SBA301_Hibernate_Project.service.IStudentService;
import sba301.fu.SBA301_Hibernate_Project.service.StudentService;

public class LoginController implements Initializable {
    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtPassword;

    private IStudentService iStudentService;

    public LoginController() {
        iStudentService = new StudentService();
    }

    @Override
    public void initialize(URL arg0, ResourceBundle arg1) {
        // TODO Auto-generated method stub
    }

    @FXML
    public void login() throws IOException {
        Student account = iStudentService.findByEmail(txtEmail.getText());

        // Logic kiểm tra tài khoản và mật khẩu
        if (account != null && account.getPassword().equals(txtPassword.getText())) {

            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/student-view.fxml"));
            Parent root = fxmlLoader.load();
            Stage stage = new Stage();
            stage.setScene(new Scene(root));
            stage.show();

            // Bạn có thể thêm code để đóng cửa sổ đăng nhập hiện tại tại đây
        }
    }

    @FXML
    public void logout() throws IOException {
        Platform.exit();
    }

    @FXML
    public void hello() {
        // Phương thức này hiện đang để trống theo ảnh chụp
    }
}
