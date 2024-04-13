package vttp.csf.backend.exceptions;

public class UsernameExistsException extends Exception {
    public UsernameExistsException() {
        super();
    }

    public UsernameExistsException(String message) {
        super(message);
    }
}
