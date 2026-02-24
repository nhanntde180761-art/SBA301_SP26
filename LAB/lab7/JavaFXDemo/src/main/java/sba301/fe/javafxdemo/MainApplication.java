package sba301.fe.javafxdemo;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainApplication extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader fxmlLoader = new FXMLLoader(MainApplication.class.getResource("/LoginGUI.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("JavaFX Demo");
        stage.setScene(scene);
        stage.show();
    }

    public  static void main(String[] args) {
        launch(args);
    }
}
