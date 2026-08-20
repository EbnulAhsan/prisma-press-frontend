import { Button } from "@/components/ui/button";
import { getMe } from "@/service/getMe";


export default async function HomePage() {
  console.log("Root Route")
  const user = await getMe()
  return (
    <div>

      hello  , next .js 

    


      <Button>
        Click me 
     </Button>
    </div>
  );
}
