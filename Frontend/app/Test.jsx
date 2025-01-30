export default function App({route}) {
    const { photo } = route.params;
  
    console.log("Received Photo URI:", photo);
  
    return (
      <View>
        <Text>Photo URI: {photo}</Text>
      </View>
    );
  };
  