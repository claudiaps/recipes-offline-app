import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type InputSearchProps = {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  handleSearch: () => void;
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 8,
    borderColor: "#007363",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 18,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 2,
  },
});

const InputSearch = ({
  placeholder,
  value,
  setValue,
  handleSearch,
}: InputSearchProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        style={styles.inputContainer}
        value={value}
        onChangeText={setValue}
      />
      <Pressable onPress={handleSearch} disabled={!value}>
        <Ionicons
          name="search"
          size={28}
          color={!value ? "#8e8e8e" : "#007363"}
        />
      </Pressable>
    </View>
  );
};

export default InputSearch;
