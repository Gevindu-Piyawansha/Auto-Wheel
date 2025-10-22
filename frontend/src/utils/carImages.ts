// Professional car images for the car listing application
export const carImages = {
  toyota: {
    camry: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center',
    corolla: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&h=600&fit=crop&crop=center',
    rav4: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center'
  },
  bmw: {
    x5: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
    x3: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&h=600&fit=crop&crop=center',
    series3: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&crop=center'
  },
  tesla: {
    model3: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center',
    modelS: 'https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&h=600&fit=crop&crop=center',
    modelY: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop&crop=center'
  },
  mercedes: {
    cClass: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
    eClass: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
    gle: 'https://images.unsplash.com/photo-1606016872687-22c04450ac84?w=800&h=600&fit=crop&crop=center'
  },
  audi: {
    a4: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&h=600&fit=crop&crop=center',
    q5: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=600&fit=crop&crop=center',
    a6: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop&crop=center'
  },
  volkswagen: {
    golf: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop&crop=center',
    passat: 'https://images.unsplash.com/photo-1613294434563-aac4ac7b2330?w=800&h=600&fit=crop&crop=center',
    tiguan: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center'
  }
};

// Get car image by make and model
export const getCarImage = (make: string, model: string): string => {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase().replace(/\s+/g, '');
  
  // Try to find specific image
  if (carImages[makeLower as keyof typeof carImages]) {
    const makeImages = carImages[makeLower as keyof typeof carImages];
    
    // Try to match model
    const modelKey = Object.keys(makeImages).find(key => 
      modelLower.includes(key.toLowerCase()) || key.toLowerCase().includes(modelLower)
    );
    
    if (modelKey) {
      return makeImages[modelKey as keyof typeof makeImages];
    }
    
    // Return first image if no specific model match
    return Object.values(makeImages)[0];
  }
  
  // Default fallback image
  return 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center';
};

// Car placeholder for missing images
export const carPlaceholder = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center';

export default carImages;