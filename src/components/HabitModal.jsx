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
                    {mode === "edit" ? "Edit Habit" : "Add Habit"}
                </h2>

                <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter a habit"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div style={styles.buttonRow}>
                    <button style={styles.saveButton} onClick={onSave}>
                        Save
                    </button>

                    <button style={styles.cancelButton} onClick={onCancel}>
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
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },

    modal: {
        backgroundColor: "white",
        padding: "36px 40px",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
        minWidth: "420px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    },

    modalHeader: {
        fontSize: "28px",
        textAlign: "center",
        margin: 0,
    },

    input: {
        padding: "12px 18px",
        border: "2px solid #e6b98f",
        borderRadius: "999px",
        fontSize: "18px",
    },

    buttonRow: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
    },

    saveButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "999px",
        background: "#f4a261",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
    },

    cancelButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "999px",
        background: "#fff",
        color: "#8a4f32",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
    },
};