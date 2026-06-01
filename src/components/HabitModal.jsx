export default function HabitModal({
  mode,
  text,
  setText,
  onSave,
  onCancel
}) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalHeader}>
          {mode === "edit" ? "Edit Habit" : "Add Habit"}</h2>

        <input
          type="text"
          placeholder="Enter a habit"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div style={styles.buttonRow}>
          <button data-testid="habit-modal-save-btn" onClick={onSave}>
            Save
          </button>

          <button data-testid="habit-modal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
  },

  modalHeader: {
    color: "black",
  },
};