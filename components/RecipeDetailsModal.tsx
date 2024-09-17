import {
  Modal,
  Text,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import ParallaxScrollView from "./ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RecipeDetails, RecipeDetailsQuery } from "@/types/recipes";
import { useRecipeDatabase } from "@/database/recipeService";

const API_KEY = "5d393e23f5a845a1ab6c08a1bbbc7646";

const Info = ({ label, value }: { label: string; value?: string | number }) => {
  return (
    <View style={styles.info}>
      <Text>{label}</Text>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{value}</Text>
    </View>
  );
};

const IngredientItem = ({
  amount,
  unitShort,
  name,
}: {
  amount: number;
  unitShort: string;
  name: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        borderBottomWidth: 1,
        padding: 8,

        borderBlockColor: "#e6e6e6",
      }}
    >
      <Text
        style={{ color: "#04a691", fontSize: 16 }}
      >{`${amount}${unitShort}`}</Text>
      <Text style={{ fontSize: 16 }}>{name}</Text>
    </View>
  );
};

type RecipeDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  recipeId?: number;
  offline: boolean;
};

const RecipeDetailsModal = ({
  visible,
  onClose,
  recipeId,
  offline,
}: RecipeDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeDetails>();
  const [isRecipeOffline, setIsRecipeOffline] = useState<boolean>();

  const { create, getRecipeById, getFullRecipeById } = useRecipeDatabase();

  const getRecipeInfo = useCallback(async () => {
    try {
      setLoading(true);
      if (recipeId) {
        if (offline) {
          const response = await getFullRecipeById(recipeId);
          setRecipe(response as RecipeDetails);
          return;
        }
        const { data }: RecipeDetailsQuery = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        );

        setRecipe(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  const onCLoseModal = () => {
    setRecipe(undefined);
    setIsRecipeOffline(undefined);
    onClose();
  };

  const checkOfflineRecipe = useCallback(async () => {
    if (recipeId) {
      const response = await getRecipeById(recipeId);
      if (response) {
        setIsRecipeOffline(true);
      }
    }
  }, [recipeId, getRecipeById]);

  useEffect(() => {
    if (recipeId) {
      getRecipeInfo();
      checkOfflineRecipe();
    }
  }, [recipeId]);

  const handleSaveRecipeOffline = async () => {
    if (recipe) {
      try {
        setLoading(true);
        await create({ recipe });
        setIsRecipeOffline(true);
        Alert.alert("Success!");
      } catch (error) {
        Alert.alert("Error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onCLoseModal}
      animationType="slide"
    >
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 64 }} />
      ) : (
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
          headerImage={
            <>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons size={32} name="close" />
              </Pressable>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{
                  uri: recipe?.image,
                }}
              />
            </>
          }
        >
          <View style={styles.container}>
            <View style={styles.titleContianer}>
              <Text style={styles.recipeTitle}>{recipe?.title}</Text>
              {!isRecipeOffline && (
                <Pressable onPress={handleSaveRecipeOffline}>
                  <Text
                    style={{ fontSize: 18, paddingTop: 8, color: "#04a691" }}
                  >
                    Save
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={styles.infoContainer}>
              <Info label="Servings:" value={recipe?.servings} />
              <Info
                label="Ready in:"
                value={`${recipe?.readyInMinutes} minutes`}
              />
            </View>
            <View style={styles.ingredients}>
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              {recipe?.extendedIngredients?.map((ingredient) => (
                <IngredientItem
                  amount={ingredient?.measures?.metric?.amount}
                  unitShort={ingredient?.measures?.metric?.unitShort}
                  name={ingredient.name}
                />
              ))}
            </View>
          </View>
        </ParallaxScrollView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 0,
    zIndex: 10,
    padding: 8,
  },
  titleContianer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    paddingBottom: 28,
  },
  recipeTitle: {
    fontSize: 28,
  },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#fafafa",
  },
  info: {
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 24,
  },
  ingredients: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
    paddingBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 20,
    paddingBottom: 12,
    color: "#04a691",
  },
});

export default RecipeDetailsModal;
