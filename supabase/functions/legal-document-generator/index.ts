
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[LEGAL-DOC-GEN] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, entityName, documentType, details } = await req.json();

    if (action === 'health_check') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'legal-document-generator' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'generate_document') {
      console.log(`[LEGAL-DOC-GEN] Generating ${documentType} for ${entityName}`);
      
      // Generate legal document based on type
      let documentContent = '';
      
      switch (documentType) {
        case 'cease_desist':
          documentContent = generateCeaseDesist(entityName, details);
          break;
        case 'dmca_takedown':
          documentContent = generateDMCATakedown(entityName, details);
          break;
        case 'defamation_notice':
          documentContent = generateDefamationNotice(entityName, details);
          break;
        case 'privacy_violation':
          documentContent = generatePrivacyViolationNotice(entityName, details);
          break;
        default:
          throw new Error('Unsupported document type');
      }

      // Store generated document
      const { data: document, error } = await supabase
        .from('legal_documents')
        .insert({
          entity_name: entityName,
          document_type: documentType,
          content: documentContent,
          status: 'generated',
          generated_by: 'aria_legal_generator',
          details: details
        })
        .select()
        .single();

      if (error) {
        console.error('[LEGAL-DOC-GEN] Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        document: document,
        preview: documentContent.substring(0, 200) + '...'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[LEGAL-DOC-GEN] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateCeaseDesist(entityName: string, details: any): string {
  const date = new Date().toLocaleDateString();
  
  return `CEASE AND DESIST NOTICE

Date: ${date}
Re: ${entityName}

Dear Sir/Madam,

This letter serves as formal notice that you must CEASE AND DESIST from the continued publication, distribution, and dissemination of false, defamatory, and injurious statements concerning ${entityName}.

The following statements are false and defamatory:
${details.allegations || 'Specific allegations to be detailed'}

These statements are demonstrably false and have caused significant harm to ${entityName}'s reputation and business interests.

DEMAND FOR IMMEDIATE ACTION:
1. Immediately cease and desist from making any further false statements
2. Remove all existing defamatory content within 72 hours
3. Provide written confirmation of compliance

Failure to comply will result in pursuing all available legal remedies, including but not limited to monetary damages and injunctive relief.

This notice is made without prejudice to any rights or remedies available at law or in equity.

Sincerely,
Legal Representative for ${entityName}`;
}

function generateDMCATakedown(entityName: string, details: any): string {
  const date = new Date().toLocaleDateString();
  
  return `DMCA TAKEDOWN NOTICE

Date: ${date}
To: Content Platform Legal Department

I am writing to notify you of copyright infringement on your platform concerning ${entityName}.

IDENTIFICATION OF COPYRIGHTED WORK:
${details.copyrightedWork || 'Copyrighted material description'}

IDENTIFICATION OF INFRINGING MATERIAL:
URL(s): ${details.infringingUrls || 'URLs to be specified'}

CONTACT INFORMATION:
Representative for: ${entityName}
${details.contactInfo || 'Contact information'}

GOOD FAITH STATEMENT:
I have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.

ACCURACY STATEMENT:
The information in this notification is accurate, and under penalty of perjury, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.

Please remove or disable access to this material immediately.

Sincerely,
DMCA Agent for ${entityName}`;
}

function generateDefamationNotice(entityName: string, details: any): string {
  const date = new Date().toLocaleDateString();
  
  return `DEFAMATION NOTICE AND DEMAND FOR RETRACTION

Date: ${date}
Re: Defamatory Statements Concerning ${entityName}

Dear Sir/Madam,

Your recent publication contains false and defamatory statements about ${entityName} that require immediate correction and retraction.

FALSE STATEMENTS IDENTIFIED:
${details.falseStatements || 'Specific false statements to be detailed'}

FACTUAL CORRECTIONS:
${details.corrections || 'Accurate information to be provided'}

These false statements have caused significant reputational and financial harm to ${entityName}.

DEMAND FOR IMMEDIATE ACTION:
1. Publish a prominent retraction within 48 hours
2. Remove the defamatory content
3. Cease further publication of false statements

We reserve all rights to pursue legal action for damages if this matter is not resolved promptly.

Time is of the essence.

Legal Counsel for ${entityName}`;
}

function generatePrivacyViolationNotice(entityName: string, details: any): string {
  const date = new Date().toLocaleDateString();
  
  return `PRIVACY VIOLATION NOTICE

Date: ${date}
Re: Unauthorized Use of Private Information - ${entityName}

Dear Platform Administrator,

This notice concerns the unauthorized publication of private information belonging to ${entityName} on your platform.

PRIVACY VIOLATIONS IDENTIFIED:
${details.privacyViolations || 'Specific privacy violations to be detailed'}

LEGAL BASIS:
This content violates applicable privacy laws and platform terms of service.

IMMEDIATE ACTION REQUIRED:
1. Remove all private information within 24 hours
2. Prevent re-publication of this content
3. Provide confirmation of removal

Continued hosting of this private information may result in legal action under applicable privacy statutes.

We trust you will address this matter promptly.

Privacy Counsel for ${entityName}`;
}
