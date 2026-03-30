import insforge from "@/utils/insforge";

/**
 * High-level orchestration for scanning a medical image
 * 1. Upload to storage
 * 2. Save scan record
 * 3. AI Analysis
 * 4. Save analysis result
 */
export const uploadAndAnalyzeScan = async (file, userId, patientData) => {
  try {
    // 1. Upload to Storage
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${timestamp}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('medical-scans')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const fileUrl = uploadData.url;
    const fileKey = uploadData.key;

    // 2. Insert into 'scans' table
    const { data: scanRecords, error: scanError } = await insforge.database
      .from('scans')
      .insert({
        user_id: userId,
        file_url: fileUrl,
        file_key: fileKey,
        file_type: file.type.startsWith('image') ? 'image' : 'video',
        file_name: file.name,
        status: 'analyzing'
      })
      .select();

    if (scanError) throw scanError;
    const scanId = scanRecords[0].id;

    // 3. AI Analysis
    // Construct a rich prompt with patient context
    const symptomsStr = patientData?.symptoms?.length > 0
      ? patientData.symptoms.join(', ')
      : 'No specific symptoms reported';
    
    const systemPrompt = `You are an advanced medical AI diagnostic assistant. 
    Analyze the provided medical scan (X-ray/MRI/etc.) considering the patient's context.
    Return a detailed analysis in JSON format with the following keys:
    - diagnosis: A concise string summary of the primary finding.
    - confidence: A number between 0 and 100.
    - findings: An array of specific visual observations.
    - recommendations: An array of suggested next steps.
    - severity: 'low' | 'moderate' | 'high' | 'critical'.
    Be professional and precise.`;

    const userPrompt = `Patient ID: ${userId}
    Age: ${patientData?.age || 'Unknown'}
    Reported Symptoms: ${symptomsStr}
    Medical History: ${JSON.stringify(patientData?.medical_history || {})}
    Please analyze this scan.`;

    const { data: aiResponse, error: aiError } = await insforge.ai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: fileUrl } }
          ] 
        }
      ]
    });

    if (aiError) throw aiError;

    // Parse the AI Response (assuming it returns JSON as requested)
    let parsedResult;
    try {
      const content = aiResponse.choices[0].message.content;
      // Handle potential markdown blocks in AI response
      const jsonStr = content.includes('```json') 
        ? content.split('```json')[1].split('```')[0].trim()
        : content.trim();
      parsedResult = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("AI Response parsing failed:", parseErr, aiResponse.choices[0].message.content);
      parsedResult = {
        diagnosis: "Unable to parse AI response. Check logs.",
        confidence: 0,
        details: { raw: aiResponse.choices[0].message.content }
      };
    }

    // 4. Save into 'scan_results'
    const { error: resultError } = await insforge.database
      .from('scan_results')
      .insert({
        scan_id: scanId,
        user_id: userId,
        diagnosis: parsedResult.diagnosis,
        confidence: parsedResult.confidence,
        details: parsedResult,
        model_used: 'openai/gpt-4o-mini'
      });

    if (resultError) throw resultError;

    // 5. Update scan status to 'completed'
    await insforge.database
      .from('scans')
      .update({ status: 'completed' })
      .eq('id', scanId);

    return { scanId, result: parsedResult };

  } catch (err) {
    console.error("Scan processing failed:", err);
    throw err;
  }
};
