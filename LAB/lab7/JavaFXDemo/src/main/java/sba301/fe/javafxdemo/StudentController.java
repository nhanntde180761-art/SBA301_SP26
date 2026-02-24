package sba301.fe.javafxdemo;

import sba301.fu.SBA301_Hibernate_Project.pojo.Student;
import sba301.fu.SBA301_Hibernate_Project.service.IStudentService;
import sba301.fu.SBA301_Hibernate_Project.service.StudentService;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

import java.net.URL;
import java.util.ResourceBundle;

public class StudentController implements Initializable {
    @FXML
    private TableView<Student> tbData;
    @FXML
    public TableColumn<Student, Integer> studentId;
    @FXML
    public TableColumn<Student, String> email;
    @FXML
    public TableColumn<Student, String> password;
    @FXML
    public TableColumn<Student, String> firstName;
    @FXML
    public TableColumn<Student, String> lastName;
    @FXML
    public TableColumn<Student, Integer> totalMark;

    @FXML
    private TextField txtEmail;
    @FXML
    private TextField txtPassword;
    @FXML
    private TextField txtLastName;
    @FXML
    private TextField txtFirstName;
    @FXML
    private TextField txtTotalMark;

    private int idStudent;
    private IStudentService iStudentService;
    private ObservableList<Student> studentsModels;

    public StudentController() {
        iStudentService = new StudentService();
        studentsModels = FXCollections.observableArrayList(iStudentService.findAll());
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // Cấu hình các cột trong TableView mapping với thuộc tính của POJO
        studentId.setCellValueFactory(new PropertyValueFactory<>("id"));
        firstName.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        lastName.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        email.setCellValueFactory(new PropertyValueFactory<>("email"));
        password.setCellValueFactory(new PropertyValueFactory<>("password"));
        totalMark.setCellValueFactory(new PropertyValueFactory<>("marks"));

        tbData.setItems(studentsModels);

        // Lắng nghe sự kiện chọn dòng trên bảng
        tbData.getSelectionModel().selectedItemProperty().addListener(new ChangeListener() {
            @Override
            public void changed(ObservableValue observableValue, Object oldValue, Object index) {
                if (tbData.getSelectionModel().getSelectedItem() != null) {
                    TableView.TableViewSelectionModel selectionModel = tbData.getSelectionModel();
                    ObservableList selectedCells = selectionModel.getSelectedCells();
                    TablePosition tablePosition = (TablePosition) selectedCells.get(0);

                    Object studentID = tablePosition.getTableColumn().getCellData(index);

                    try {
                        Student student = iStudentService.findById(Integer.valueOf(studentID.toString()));
                        showStudent(student);
                    } catch (Exception ex) {
                        showAlert("Information Board !", "Please choose the First Cell !");
                    }
                }
            }
        });
    }

    public void showAlert(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void showStudent(Student student) {
        this.setIdStudent(student.getId());
        this.txtFirstName.setText(student.getFirstName());
        this.txtEmail.setText(student.getEmail());
        this.txtPassword.setText(student.getPassword());
        this.txtLastName.setText(student.getLastName());
        this.txtTotalMark.setText(String.valueOf(student.getMarks()));
    }

    private void refreshDataTable() {
        this.setIdStudent(0);
        this.txtFirstName.setText("");
        this.txtLastName.setText("");
        this.txtTotalMark.setText("");
        this.txtEmail.setText("");
        this.txtPassword.setText("");
        studentsModels = FXCollections.observableArrayList(iStudentService.findAll());
        tbData.setItems(studentsModels);
    }

    @FXML
    public void addStudent() {
        Student student = new Student(this.txtEmail.getText(), this.txtPassword.getText(),
                this.txtFirstName.getText(), this.txtLastName.getText());
        student.setMarks(Integer.parseInt(txtTotalMark.getText()));
        iStudentService.save(student);
        refreshDataTable();
    }

    @FXML
    public void deleteStudent() {
        iStudentService.delete(this.getIdStudent());
        refreshDataTable();
    }

    @FXML
    public void updateStudent() {
        Student student = new Student(this.idStudent, this.txtEmail.getText(), this.txtPassword.getText(),
                this.txtFirstName.getText(), this.txtLastName.getText());
        student.setMarks(Integer.parseInt(txtTotalMark.getText()));
        iStudentService.update(student);
        refreshDataTable();
    }

    public int getIdStudent() { return idStudent; }
    public void setIdStudent(int idStudent) { this.idStudent = idStudent; }
}