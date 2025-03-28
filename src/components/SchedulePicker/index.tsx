import React, { FC, useState } from "react";
import { Platform, TextStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDateTime: (date: Date) => void;
}

const CalendarModal: FC<CalendarModalProps> = ({
  visible,
  onClose,
  onSelectDateTime,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="datetime"
      display={Platform.OS === "ios" ? "inline" : "default"}
      date={date}
      onConfirm={(selectedDate: Date) => {
        setDate(selectedDate);
        onSelectDateTime(selectedDate);
        onClose();
      }}
      modalStyleIOS={{
        justifyContent: "center",
        alignItems: "center",
      }}
      pickerStyleIOS={{
        backgroundColor: "#00B0B9",
      }}
      onCancel={onClose}
      buttonTextColorIOS="#00B0B9"
      accentColor="white"
      textColor="black"
      style={{}}
      customCancelButtonIOS={() => <></>}
    />
  );
};

export default CalendarModal;
