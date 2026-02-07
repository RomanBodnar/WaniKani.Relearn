using System;
using System.Reflection;

namespace WaniKani.Relearn.Http;

public sealed class BooleanUrlParameterFormatter : DefaultUrlParameterFormatter
{
    public override string? Format(object? parameterValue, ICustomAttributeProvider attributeProvider, Type type)
    {
        if (parameterValue is bool)
        {
            return parameterValue.ToString()!.ToLower();
        }

        return base.Format(parameterValue, attributeProvider, type);
    }
}

