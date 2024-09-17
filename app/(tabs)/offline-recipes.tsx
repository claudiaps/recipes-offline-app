import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import { RecipeSummary } from "@/types/recipes";
import { FlatList } from "react-native-gesture-handler";
import RecipeDetailsModal from "@/components/RecipeDetailsModal";
import { useRecipeDatabase } from "@/database/recipeService";

const API_KEY = "5d393e23f5a845a1ab6c08a1bbbc7646";

const RecipeListItem = ({
  recipe,
  onPressRecipe,
}: {
  recipe: RecipeSummary;
  onPressRecipe: (id: number) => void;
}) => {
  return (
    <Pressable
      style={styles.recipeItemContainer}
      onPress={() => onPressRecipe(recipe.id)}
    >
      <Image
        style={{ width: 100, height: 100, borderRadius: 8 }}
        source={{
          uri: recipe.image,
        }}
      />
      <Text style={styles.recipeItemTitle}>{recipe.title}</Text>
    </Pressable>
  );
};

export default function OfflineRecipesList() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number>();
  const { getRecipes } = useRecipeDatabase();

  const onPressRecipe = (recipeId: number) => {
    setSelectedRecipeId(recipeId);
  };

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const recipes = await getRecipes();
      setRecipes(recipes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView>
        <View style={{ paddingHorizontal: 16 }}>
          <FlatList
            data={recipes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <RecipeListItem recipe={item} onPressRecipe={onPressRecipe} />
            )}
          />
        </View>
        <RecipeDetailsModal
          visible={Boolean(selectedRecipeId)}
          onClose={() => setSelectedRecipeId(undefined)}
          recipeId={selectedRecipeId}
          offline={true}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 12,
  },
  recipeItemContainer: {
    flexDirection: "row",
    gap: 16,
    padding: 8,
    marginVertical: 8,
    backgroundColor: "#fafafa",
    borderRadius: 8,
  },
  recipeItemTitle: {
    fontSize: 22,
    color: "#007363",
    flexShrink: 1,
  },
});
