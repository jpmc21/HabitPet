export default function HabitModal({
  mode,
  habit,
  setHabit,
  onSave,
  onCancel,

}) {

  //Updates a specific field inside the habit object
  //Only changes the one field, keeps the other fields the same
  function updateHabitField(field, value) {
    setHabit((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalHeader}>
          {mode === "edit" ? "Edit Habit" : "Add Habit"}
        </h2>

        {/*Input for the habit title*/}
        <input
          style={styles.input}
          type="text"
          placeholder="Enter a habit"
          value={habit.title}
          onChange={(e) => updateHabitField("title", e.target.value)}
          data-testid="habit-modal-title-input"
        />

        {/*Text area for the habit description*/}
        <textarea
          style={styles.textarea}
          placeholder="Enter Description"
          value={habit.description}
          onChange={(e) => updateHabitField("description", e.target.value)}
          data-testid="habit-modal-description-input"
        />

        {/*Creates a dropdown menue for selecting how often the hait should be completed*/}
        <select
          style={styles.select}
          value={habit.frequency}
          onChange={(e) => updateHabitField("frequency", e.target.value)}
          data-testid="habit-modal-frequency-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>

        </select>

        {/*Buttons for saving or canceling the modal*/}
        <div style={styles.buttonRow}>
          <div style={styles.buttonRow}>
            <button style={styles.saveButton} data-testid="habit-modal-save-btn" onClick={(onSave)}>
              Save
            </button>

            <button style={styles.cancelButton} data-testid="habit-modal-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "0 40px",
  },

  modal: {
    backgroundColor: "white",
    padding: "36px 40px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    width: "650px",
    minWidth: "420px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
    zIndex: 1001,
  },

  modalHeader: {
    color: "black",
    fontSize: "42px",
    textAlign: "center",
    margin: 0,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 20px",
    border: "2px solid #e6b98f",
    borderRadius: "999px",
    fontSize: "20px",
    outline: "none",
    textAlign: "center",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 20px",
    border: "2px solid #e6b98f",
    borderRadius: "18px",
    fontSize: "18px",
    outline: "none",
    resize: "vertical",
    minHeight: "120px",
    fontFamily: "inherit",
    color: "black",
    backgroundColor: "white",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 20px",
    border: "2px solid #e6b98f",
    borderRadius: "999px",
    fontSize: "18px",
    outline: "none",
    backgroundColor: "white",
    color: "black",
    cursor: "pointer",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },

  saveButton: {
    padding: "9px 18px",
    border: "none",
    borderRadius: "999px",
    background: "#f4a261",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  cancelButton: {
    padding: "9px 18px",
    border: "none",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#8a4f32",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(90, 60, 30, 0.10)",
  },
};